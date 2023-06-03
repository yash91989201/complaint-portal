import Head from "next/head";
import ComplaintCard from "@/components/complaint/ComplaintCard";
import ComplaintActionBar from "@/components/complaint/ComplaintActionBar";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const complaintViewStyling = (isGridView: boolean) => {
  if (isGridView) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1";
};

import { ComplaintFilterContext } from "@/components/shared/Layout";
import { useContext } from "react";
import { Asterisk } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isGridView, setIsGridView] = useState(false);
  const toggleGridView = () => setIsGridView(!isGridView);

  const { filteredComplaints } = useContext(ComplaintFilterContext);
  const publicComplaints = filteredComplaints.filter(
    (complaint) => complaint.is_public
  );

  return (
    <>
      <Head>
        <title>Complaint Portal | Home</title>
      </Head>
      <main className="flex flex-col max-w-6xl px-3 mx-auto my-6 space-y-6 lg:px-6 xl:px-0">
        {/* complaint action bar */}
        <ComplaintActionBar
          isGridView={isGridView}
          toggleGridView={toggleGridView}
        />
        <div className="flex flex-col min-h-[80vh] space-y-3 lg:space-x-6 lg:flex-row lg:space-y-0">
          <div
            className={`
            grid w-full gap-6 px-1 mx-auto 
           ${complaintViewStyling(isGridView)}
            `}
          >
            {publicComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.created_at.toString()}
                {...complaint}
              />
            ))}
            {publicComplaints.length === 0 && (
              <div className="flex flex-col items-center py-16 space-y-8 border rounded-md">
                <div className="relative w-72 h-72">
                  <Image
                    src="/no-complaint-available.svg"
                    alt="no complaints available"
                    fill
                  />
                </div>
                <h2 className="font-semibold text-gray-600 md:text-lg lg:text-2xl">
                  No Complaints Available
                </h2>
              </div>
            )}
          </div>
          <div className="border rounded-lg w-full lg:w-[28rem] h-fit">
            <h3 className="p-3 text-xl font-semibold border-b ">
              Complaint Portal Rules
            </h3>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="px-3">
                <AccordionTrigger>Be civilized</AccordionTrigger>
                <AccordionContent>
                  When registering a complaint be sure not to defame anyone.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="px-3">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="px-3">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="flex p-3 ">
              <Asterisk size={14} />
              Strictly Adhere to the above rules when registering a complaint.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
