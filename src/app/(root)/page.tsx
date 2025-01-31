import { DomainStatus } from "@/components/domain-status";
import { Button } from "@/components/ui/button";
import { Domain } from "domain";

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Home</h1>
      </div>
      <div
        className="flex flex-1 justify-center items-center shadow-sm border border-dashed rounded-lg"
        x-chunk="dashboard-02-chunk-1"
      >
        {/* <div className="flex flex-col items-center gap-1 text-center"> */}
        <DomainStatus />
        {/* <Button className="mt-4">Add Product</Button> */}
        {/* </div> */}
      </div>
    </>
  );
}
