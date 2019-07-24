import * as React from "react";

import { CharacterContainer } from "./containers/character";
import { CampaignServiceContainer } from "./containers/campaign";

export function Providers({children}: {children: React.ReactNode}) {
    return <CharacterContainer.Provider>
        <CampaignServiceContainer.Provider>
            {children}
        </CampaignServiceContainer.Provider>
    </CharacterContainer.Provider>
}
