import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  return (
    <div>
      <h2>LandingPage 랜딩페이지</h2>
    </div>
  );
}

export default LandingPage;
