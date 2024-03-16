import { createStore } from "zustand/vanilla";
import {
  createVendorFlowSlice,
  VendorFlowSlice,
} from "./slices/VendorFlowSlice";
import {
  createVendorApplicationSlice,
  VendorApplicationSlice,
} from "./slices/VendorApplicationSlice";

export type BoundedStore = VendorFlowSlice & VendorApplicationSlice;

export const useBoundedStore = createStore<BoundedStore>()((...a) => ({
  ...createVendorFlowSlice(...a),
  ...createVendorApplicationSlice(...a),
}));
