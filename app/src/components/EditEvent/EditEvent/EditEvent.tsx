import React from 'react';
import { IEditEvent } from 'src/types/event';
import { ValidatedDateTimeInput } from 'src/components/Common/DateTimeInput/DateTimeInput';
import {
  parseTitle,
  parseDescription,
  parseHost,
  parseMaxAttendees,
  parseLocation,
} from 'src/types';
import { parseEmail } from 'src/types/email';
import { parseTimeInstance } from 'src/types/time-instance';
import { ValidatedTextInput } from 'src/components/Common/ValidatedTextInput/ValidatedTextInput';

interface IProps {
  eventResult: IEditEvent;
  updateEvent: (event: IEditEvent) => void;
}

export const EditEvent = ({ eventResult: event, updateEvent }: IProps) => {
  return (
    <>
      <ValidatedTextInput
        label={'Tittel'}
        placeholder="Fest på Skuret"
        value={event.title}
        onChange={title =>
          updateEvent({
            ...event,
            title: parseTitle(title),
          })
        }
      />
      <div>
        <ValidatedTextInput
          label="Navn på arrangør"
          placeholder="Ola Nordmann"
          value={event.organizerName}
          onChange={organizerName =>
            updateEvent({
              ...event,
              organizerName: parseHost(organizerName),
            })
          }
        />
      </div>
      <div>
        <ValidatedTextInput
          label="E-post arrangør"
          placeholder="ola.nordmann@bekk.no"
          value={event.organizerEmail}
          onChange={organizerEmail =>
            updateEvent({
              ...event,
              organizerEmail: parseEmail(organizerEmail),
            })
          }
        />
      </div>
      <ValidatedTextInput
        label={'Lokasjon'}
        placeholder="Vippetangen"
        value={event.location}
        onChange={location =>
          updateEvent({
            ...event,
            location: parseLocation(location),
          })
        }
      />
      <ValidatedTextInput
        label={'Beskrivelse'}
        placeholder={'Dette er en beskrivelse'}
        value={event.description}
        onChange={description =>
          updateEvent({
            ...event,
            description: parseDescription(description),
          })
        }
      />
      <ValidatedDateTimeInput
        label={'Starter'}
        value={event.start}
        onChange={start =>
          updateEvent({
            ...event,
            start,
          })
        }
      />
      <ValidatedDateTimeInput
        label={'Slutter'}
        value={event.end}
        onChange={end =>
          updateEvent({
            ...event,
            end,
          })
        }
      />
      <ValidatedTextInput
        label={'Påmelding åpner'}
        value={event.openForRegistration}
        onChange={openForRegistration =>
          updateEvent({
            ...event,
            openForRegistration: parseTimeInstance(openForRegistration),
          })
        }
      />
      <ValidatedTextInput
        label={'Maks antall'}
        placeholder="0 (ingen grense)"
        value={event.maxParticipants}
        onChange={maxParticipants =>
          updateEvent({
            ...event,
            maxParticipants: parseMaxAttendees(maxParticipants),
          })
        }
      />
    </>
  );
};
