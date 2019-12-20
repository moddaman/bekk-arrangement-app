import React, { useState } from 'react';
import commonStyle from 'src/global/Common.module.scss';
import { IDateTime } from 'src/types/date-time';
import { postParticipant } from 'src/api/arrangementSvc';
import { dateAsText, isSameDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import { asString } from 'src/utils/timeleft';
import { TextInput } from '../Common/TextInput/TextInput';
import { useEvent } from 'src/hooks/eventHooks';
import { useParams } from 'react-router';
import { SectionWithValidation } from '../Common/SectionWithValidation/SectionWithValidation';
import {
  IParticipant,
  IEditParticipant,
  parseParticipant,
  initalParticipant,
} from 'src/types/participant';
import { Result, isOk } from 'src/types/validation';
import { useTimeLeft } from 'src/hooks/timeleftHooks';

export const ViewEventContainer = () => {
  const { id } = useParams();
  const [event] = useEvent(id);
  const timeLeft = useTimeLeft(event);
  const [participant, setParticipant] = useState<
    Result<IEditParticipant, IParticipant>
  >(parseParticipant(initalParticipant));

  const addParticipant = async () => {
    if (isOk(participant)) {
      const addedParticipant = await postParticipant(participant.validValue);
      alert(
        `You are attending. Check your email, ${addedParticipant.email}, for confirmation`
      );
    }
  };

  if (!event) {
    return <div>Loading</div>;
  }
  return (
    <article className={commonStyle.container}>
      <section className={commonStyle.content}>
        <h1>{event.title}</h1>
        <section>
          <DateSection startDate={event.start} endDate={event.end} />
        </section>
        <section>Location: {event.location}</section>
        <section className={commonStyle.subsection}>
          {event.description}
        </section>
      </section>
      <section className={commonStyle.column}>
        <SectionWithValidation validationResult={participant.errors}>
          <TextInput
            label={'Email'}
            value={participant.editValue.email}
            placeholder={'email'}
            onChange={(email: string) =>
              setParticipant(
                parseParticipant({ ...participant.editValue, email })
              )
            }
          />
        </SectionWithValidation>
        {timeLeft.difference > 0 ? (
          <>
            <button>Closed</button>
            <p>Opens in {asString(timeLeft)}</p>
          </>
        ) : (
          <button onClick={() => addParticipant()}>I am going</button>
        )}
      </section>
    </article>
  );
};

interface IDateProps {
  startDate: IDateTime;
  endDate: IDateTime;
}

const DateSection = ({ startDate, endDate }: IDateProps) => {
  if (isSameDate(startDate.date, endDate.date)) {
    return (
      <p>
        {dateAsText(startDate.date)} <br />
        from {stringifyTime(startDate.time)} to {stringifyTime(endDate.time)}
      </p>
    );
  }
  return (
    <p>
      From {dateAsText(startDate.date)} {stringifyTime(startDate.time)} <br />
      To {dateAsText(endDate.date)} {stringifyTime(endDate.time)}
    </p>
  );
};