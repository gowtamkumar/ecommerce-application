import { syncGeoLocation } from "@/lib/apis/geo-location/sync-geo-location";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button, Card, Typography, Alert } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiGlobe, FiRefreshCw, FiCheckCircle, FiInfo } from "react-icons/fi";

const { Title, Text, Paragraph } = Typography;

export default function SyncGeoLocation() {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function syncFun() {
    dispatch(setLoading({ sync: true }));

    try {
      const syncGeo = await syncGeoLocation();

      if (syncGeo.success) {
        setLastSync(new Date());
        toast.success("Geo-location data synchronized successfully!");
        dispatch(setLoading({}));
      } else {
        toast.error("Failed to sync geo-location data. Please try again.");
        dispatch(setLoading({}));
      }
    } catch (error) {
      toast.error("An error occurred during synchronization.");
      dispatch(setLoading({}));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl rounded-2xl overflow-hidden border-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiGlobe className="w-8 h-8" />
              </div>
              <div>
                <Title level={2} className="!text-white !mb-1">
                  Geo-Location Sync
                </Title>
                <Text className="!text-white/80">
                  Synchronize location data for your application
                </Text>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Info Alert */}
            <Alert
              message="What does this do?"
              description={
                <div className="space-y-2">
                  <Paragraph className="!mb-2">
                    This feature synchronizes geographical location data (countries, states, cities) to ensure your application has the most up-to-date information.
                  </Paragraph>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Updates country and region databases</li>
                    <li>Ensures accurate shipping and address information</li>
                    <li>Improves location-based services</li>
                  </ul>
                </div>
              }
              type="info"
              icon={<FiInfo />}
              showIcon
              className="border-indigo-200 bg-indigo-50"
            />

            {/* Last Sync Info */}
            {lastSync && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <Text strong className="text-green-900 block">
                    Last synchronized successfully
                  </Text>
                  <Text className="text-green-700 text-sm">
                    {lastSync.toLocaleString()}
                  </Text>
                </div>
              </div>
            )}

            {/* Sync Button */}
            <div className="pt-4">
              <Button
                type="primary"
                size="large"
                onClick={syncFun}
                loading={global.loading?.sync}
                disabled={global.loading?.sync}
                icon={<FiRefreshCw className={global.loading?.sync ? "animate-spin" : ""} />}
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                {global.loading?.sync ? "Synchronizing..." : "Sync Geo-Location Data"}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <Text type="secondary" className="text-sm">
                <strong>Note:</strong> This process may take a few moments depending on the amount of data to sync. Please do not close this page while synchronization is in progress.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
