"use client";

import { Vendor, columns } from "./table/VendorDataColumns";
import { TabChildProps } from "../TabState";
import DataTable from "./table/DataTable";

interface VendorApplicationsProps extends TabChildProps {
  vendorData: Vendor[];
  eventTags: string[];
}

export const VendorApplications: React.FC<VendorApplicationsProps> = ({
  event,
  vendorData,
  eventTags,
  ...modalProps
}) => {
  return (
    <div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Vendor Applications{" "}
          <span className="text-muted-foreground">{vendorData.length}</span>
        </h2>
      </div>
      <DataTable
        modalProps={modalProps}
        columns={columns}
        data={vendorData || []}
        eventData={event}
        tags={eventTags}
      />
    </div>
  );
};
