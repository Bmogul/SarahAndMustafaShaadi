import React, { useState, useEffect } from "react";
import IndividualEntry from "./individualEntry.js";

const EventForm = ({ title, date, location, members, updateMember }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (members !== undefined) {
      setIsLoading(false);
    }
  }, [members]);

  // Check if the title is "Shaadi Jaman & Darees"
  const isMainEvent = title === "Ruhksati";

  // Find the member with a non-zero MainFlag value (only if it's the main event)
  const memberWithFlag = isMainEvent
    ? members?.find(
        (member) =>
          !isNaN(parseInt(member.MainFlag)) && parseInt(member.MainFlag) > 0,
      )
    : null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="eventFormContainer">
      <div className="row d-flex mt-3 formHeader2">
        <div className="d-flex justify-content-left formDetailTitle ">
          <label className="fs-3">{title}</label>
        </div>
        <div className="d-flex justify-content-left formDetailContainer ">
          <img className="figIcon" src="/Date_range_fill.svg" />
          <label className="fs-6 formDetail">{date}</label>
        </div>
        <div className="d-flex justify-content-left formDetailContainer ">
          <img className="figIcon" src="/Pin_alt.svg" />
          <label className="fs-6 formDetail">{location}</label>
        </div>
      </div>
      <div className="FormResponseBox">
        {/* Render IndividualEntry for the member with a non-zero MainFlag (only if it's the main event) */}
        {memberWithFlag && (
          <IndividualEntry
            key={memberWithFlag.HOFID}
            member={memberWithFlag}
            event={title}
            updateMember={updateMember}
          />
        )}

        {/* Render all members (if it's not the main event) */}
        {!isMainEvent &&
          members &&
          members.map((member, index) => (
            <IndividualEntry
              key={index}
              member={member}
              event={title}
              updateMember={updateMember}
            />
          ))}

        {/* Render other members without a MainFlag (if it's the main event) */}
        {isMainEvent &&
          members &&
          members
            .filter((member) => member.MainFlag === null)
            .map((member, index) => (
              <IndividualEntry
                key={index}
                member={member}
                event={title}
                updateMember={updateMember}
              />
            ))}
      </div>
    </div>
  );
};

export default EventForm;
