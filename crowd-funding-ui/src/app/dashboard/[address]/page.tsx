"use client";

import CreateContract from "@/components/CreateContract";
import { useParams } from "next/navigation";
import React from "react";

const DashBoardPage = () => {
  const params = useParams<{ address: string }>();
  console.log(params);

  return (
    <section className="size-full">
      <h1>My contracts</h1>

      <div className="my-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="border p-4">Contract 1</div>
        <div className="border p-4">Contract 2</div>
        <div className="border p-4">Contract 3</div>
        <div className="border p-4">Contract 4</div>

        <CreateContract />
      </div>
    </section>
  );
};

export default DashBoardPage;
