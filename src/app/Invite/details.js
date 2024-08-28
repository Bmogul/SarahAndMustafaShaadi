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
    if (headMember.FamilyOrder !== null && parseInt(headMember.FamilyOrder) == 1) {
      setIsHeadMemberWithMainFlag(true);
    }
  }, [headMember]);

  return (
    <div className="container">
      <div className="row mb-3">
        <h2>We cordially invite you</h2>
      </div>

      <div className="row mb-3 d-flex justify-content-center text-center ">
        {isHeadMemberWithMainFlag ? (
          <label className="fs-4 w-100">{headMember.Name}</label>
        ) : (

          family
            .sort((a, b) => a.FamilyOrder - b.FamilyOrder)
            .map((member, index) =>
              member.MainInvite > 0 ? (
                <label key={index} className="fs-4 w-100">
                  {member.Title} {member.Name}
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
