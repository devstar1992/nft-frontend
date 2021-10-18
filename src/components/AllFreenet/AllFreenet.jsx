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
            {freenetCount.toNumber()}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {freenet.map((data, i) => (
          <div
          key={i}
          className="w-50 p-4 mt-1 border"
        >
          Full name : {data.fullname}
          <br />
          Email: {data.email}
          <br />
          KYC: <img src={"https://ipfs.infura.io/ipfs/"+data.image} style={{ width: '50px', height: '50px' }} />

        </div>
        ))}
      </div>
    </div>
  );
};

export default AllFreenet;
