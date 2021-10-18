import React, { useState, useEffect } from "react";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

const AllFreenet = ({
  freenet,
  accountAddress,
  freenetCount 
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (freenet.length !== 0) {
      if (freenet[0].kyx !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [freenet]);
  console.log(freenet);
  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total  :{" "}
            {freenetCount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {freenet.map((cryptoboy, i) => {
          return (
            <div
              key={i}
              className="w-50 p-4 mt-1 border"
            >
             Full name : {cryptoboy.fullname}
              Email: {cryptoboy.email}
              KYC: <img src={cryptoboy.kyc} style={{width:'50px', height:'50px'}} />
             
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllFreenet;
