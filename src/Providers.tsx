import * as React from "react";

import { CampaignServiceContainer } from "./containers/campaign";
import { DataServiceContainer } from "./containers/dataService";

export function Providers({ children }: { children: React.ReactNode }) {
    return <DataServiceContainer.Provider>
        <CampaignServiceContainer.Provider>
            {children}
        </CampaignServiceContainer.Provider>
    </DataServiceContainer.Provider>
}
