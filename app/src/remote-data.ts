import { useState, useEffect, useCallback } from 'react';
import { isError } from 'util';
import { useNotification } from './components/NotificationHandler/NotificationHandler';

export type Ok<T> = {
  status: 'OK';
  dataIsStale?: false;
  data: T;
};

export type Loading = {
  status: 'LOADING';
};

export type Updating<T> = {
  status: 'UPDATING';
  dataIsStale: true;
  data: T;
};

export type NotRequested = {
  status: 'NOT_REQUESTED';
};

export type Bad = {
  status: 'ERROR';
  userMessage: string;
};

export type RemoteData<T> = Ok<T> | Loading | Updating<T> | Bad | NotRequested;

export function isLoading<T>(data: RemoteData<T>): data is Loading {
  return data.status === 'LOADING';
}

export function isUpdating<T>(data: RemoteData<T>): data is Updating<T> {
  return data.status === 'UPDATING';
}

export function isFresh<T>(data: RemoteData<T>): data is Ok<T> {
  return data.status === 'OK';
}

export function hasLoaded<T>(data: RemoteData<T>): data is Ok<T> | Updating<T> {
  return isFresh(data) || isUpdating(data);
}

export function isNotRequested<T>(data: RemoteData<T>): data is NotRequested {
  return data.status === 'NOT_REQUESTED';
}

export function isBad<T>(data: RemoteData<T>): data is Bad {
  return data.status === 'ERROR';
}

export function cachedRemoteData<Key extends string, T>() {
  let cache: Map<Key, RemoteData<T>> = new Map();

  return {
    useAll: (
      fetcher: () => Promise<Array<[Key, T]>>
    ): Map<Key, RemoteData<T>> => {
      const { notify } = useNotification();
      const values = useRemoteData(fetcher);

      useEffect(() => {
        if (isBad(values)) {
          const message = values.userMessage;
          notify({
            type: 'ERROR',
            title: 'All dataen kan ikkje lastes',
            message,
          });
        }
      }, [values, notify]);

      if (hasLoaded(values)) {
        values.data.forEach(([key, value]) => {
          cache.set(key, {
            status: 'UPDATING',
            dataIsStale: true,
            data: value,
          });
        });

        return new Map([
          ...cache,
          ...values.data.map(
            ([key, value]) =>
              [key, { status: 'OK', data: value }] as [Key, Ok<T>]
          ),
        ]);
      }

      return cache;
    },
    useOne: ({
      key,
      fetcher,
    }: {
      key: Key;
      fetcher: () => Promise<T>;
    }): RemoteData<T> => {
      const value = useRemoteData(fetcher);

      const cachedValue = cache.get(key);
      if (cachedValue) {
        if (
          (isNotRequested(value) || isLoading(value)) &&
          hasLoaded(cachedValue)
        ) {
          return cachedValue;
        }
      }

      if (hasLoaded(value)) {
        cache.set(key, {
          status: 'UPDATING',
          dataIsStale: true,
          data: value.data,
        });
      }

      return value;
    },
  };
}

export const useRemoteData = <T>(fetcher: () => Promise<T>): RemoteData<T> => {
  const [remoteData, updateRemoteData] = useUpdateRemoteData(fetcher);
  useEffect(() => {
    updateRemoteData(undefined);
  }, [updateRemoteData]);
  return remoteData;
};

export const useUpdateRemoteData = <T, P>(
  fetcher: (param: P) => Promise<T>
): [RemoteData<T>, (param: P) => void] => {
  const [remoteData, setRemoteData] = useState<RemoteData<T>>({
    status: 'NOT_REQUESTED',
  });

  const updateRemoteData = useCallback(
    (param: P) => {
      setRemoteData(remoteData => {
        if (hasLoaded(remoteData)) {
          return {
            status: 'UPDATING',
            dataIsStale: true,
            data: remoteData.data,
          };
        }
        if (isError(remoteData) || isNotRequested(remoteData)) {
          return { status: 'LOADING' };
        }
        return remoteData;
      });
      fetcher(param)
        .then(data => setRemoteData({ status: 'OK', data }))
        .catch(({ userMessage }) => {
          return setRemoteData({
            status: 'ERROR',
            userMessage,
          });
        });
    },
    [fetcher]
  );

  return [remoteData, updateRemoteData];
};
