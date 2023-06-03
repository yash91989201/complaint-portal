import { useState } from "react";
import { useContext } from "react";
import Head from "next/head";
import { useUserId } from "@nhost/react";
// context/s
import { ComplaintFilterContext } from "@/components/shared/Layout";
// custom components
import ComplaintCard from "@/components/complaint/ComplaintCard";
import ComplaintActionBar from "@/components/complaint/ComplaintActionBar";

export default function Home() {
  const [isGridView, setIsGridView] = useState(false);
  const toggleGridView = () => setIsGridView(!isGridView);
  const userId = useUserId();

  const { filteredComplaints } = useContext(ComplaintFilterContext);
  const userComplaints = filteredComplaints.filter(
    (complaint) => complaint.user.id === userId
  );

  return (
    <>
      <Head>
        <title>Complaint Portal | My Complaints</title>
      </Head>
      <main className="flex flex-col max-w-6xl px-3 mx-auto my-6 space-y-6 lg:px-6 xl:px-0 ">
        <ComplaintActionBar
          isGridView={isGridView}
          toggleGridView={toggleGridView}
        />
        <div className="grid w-full grid-cols-2 gap-6 px-1 mx-auto md:px-2 lg:px-3 xl:px-0">
          {userComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.created_at.toString()}
              {...complaint}
            />
          ))}
        </div>
      </main>
    </>
  );
}
