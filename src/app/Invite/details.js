import React, { useEffect, useState } from "react";
import Image from "next/image";

const Details = ({
  genericLocation,
  detailedLocation,
  rsvpDate,
  openForm,
  headMember,
  family,
}) => {
  const [isHeadMemberWithMainFlag, setIsHeadMemberWithMainFlag] =
    useState(false);

  useEffect(() => {
    if (!headMember) return;
    if (headMember.MainFlag !== null && parseInt(headMember.MainFlag) > 0) {
      setIsHeadMemberWithMainFlag(true);
    }
  }, [headMember]);

  return (
    <div className="container">
      <div className="row mb-3">
        <h2>Join Us For A Tale As Old As Time</h2>
      </div>

      <div className="row mb-3 d-flex justify-content-center text-center ">
        {isHeadMemberWithMainFlag ? (
          <label className="fs-4 w-100">{headMember.Name}</label>
        ) : (
          family.map((member, index) =>
            member.MainInvite > 0 ||
            member.MainInvite === "ALL" ||
            member.ShitabiInvite > 0 ||
            member.ShitabiInvite === "ALL" ||
            member.WalimoInvite > 0 ||
            member.WalimoInvite === "ALL" ? (
              <label key={index} className="fs-4 w-100">
                {member.Name}
              </label>
            ) : null,
          )
        )}
      </div>

      <div className="row mb-5">
        {/*<div className="col-md">
          <label>Add to Calander</label>
        </div>*/}
      </div>

      <div className="row mb-5">
        <label className="fs-3">Please RSVP by {rsvpDate}</label>
      </div>

      <div className="row d-flex justify-content-center">
        <button
          className="p-2 rounded-5 w-50 fs-4 hoverbtn"
          style={{}}
          onClick={openForm}
        >
          RSVP Now!
        </button>
      </div>
    </div>
  );
};

export default Details;
