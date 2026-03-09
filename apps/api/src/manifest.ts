/** Gather all classes to be registered in global registry before app start up */
import { GlobalRegistry } from "@inventory/shared/registry";

/** Import all entities */
import { UserEntityTypeOrm } from "@inventory/user/infrastructure";
import { RefreshTokenEntityTypeOrm } from "@inventory/auth/infrastructure";

/** Function to populate registry */
export const populateRegistry = () => {
    GlobalRegistry.addEntities([
        UserEntityTypeOrm, RefreshTokenEntityTypeOrm
    ]);
    console.log("Finished polpulating global registry");
}
