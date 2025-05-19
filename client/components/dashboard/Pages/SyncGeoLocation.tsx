import { syncGeoLocation } from "@/lib/apis/geo-location/sync-geo-location";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SyncGeoLocation() {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  async function syncFun() {
    dispatch(setLoading({ sync: true }));

    const syncGeo = await syncGeoLocation();

    if (syncGeo.success) {
      dispatch(setLoading({}));
    }

    if (!syncGeo.success) {
      dispatch(setLoading({}));
    }

    console.log("www", syncGeo);
  }
  return (
    <div className="container mx-auto flex items-center h-lvh justify-center">
      <Button
        type="primary"
        onClick={() => syncFun()}
        loading={global.loading?.sync}
        disabled={global.loading?.sync}
      >
        Sync Geo locaton
      </Button>
    </div>
  );
}
