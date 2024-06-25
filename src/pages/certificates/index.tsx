import React, { useState, useEffect } from "react";
import { Card } from "antd/lib";
import axios from "axios";
import { baseUrl } from "@/app/config/baseUrl";

interface Certificate {
  course: string;
  dateIssued: string;
  digitalSignature: string;
  digitalStamp: string;
  instructor: string;
  student: string;
  _id: string;
}

const CertificatePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const fetchCertificates = (token: string) => {
    axios
      .get(`${baseUrl}certificates`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCertificates(response.data.certificates);
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token_private");

    if (token) {
      setIsLoggedIn(true);
      fetchCertificates(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      <div>
        <h1>Your Certificates</h1>
        {certificates.map((certificate: Certificate, index) => (
          <Card
            key={index}
            title={certificate.course}
            style={{ marginBottom: "16px", width:'300px', height:'500px' }}
          >
            <p>Date Issued: {certificate.dateIssued}</p>
            <p>Instructor: {certificate.instructor}</p>
            <p>Student: {certificate.student}</p>
            <img
              src={certificate.digitalSignature}
              alt="Digital Signature"
              style={{ maxWidth: "100%" }}
            />
            <img
              src={certificate.digitalStamp}
              alt="Digital Stamp"
              style={{ maxWidth: "100%" }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificatePage;
