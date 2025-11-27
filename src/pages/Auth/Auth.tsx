import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import { AuthTabs } from "../../enum/Tab";


export default function Auth() {
  const [tab, setTab] = useState<string>(AuthTabs.LOGIN);
  const [switchTab, setSwitchTab] = useState<boolean>(true);
  return (
    <div className="min-h-screen flex flex-col items-center pt-5 bg-[#e7ebff] px-4">

      {/* Fixed heading */}
      <h1 className="text-3xl font-bold text-black mb-8">
        Inventory Management
      </h1>

      {/* Center card */}
      <Card className="w-full max-w-2xl shadow-md">
        <CardContent className="p-6">

          <Tabs value={tab} onValueChange={setTab} className="w-full">

            {/* Tab buttons */}
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value={AuthTabs.LOGIN}
                disabled={!switchTab}
                className={!switchTab ? "opacity-50 cursor-not-allowed" : ""}
              >Login</TabsTrigger>
              <TabsTrigger value={AuthTabs.REGISTER}
                disabled={!switchTab}
                className={!switchTab ? "opacity-50 cursor-not-allowed" : ""}
              >Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value={AuthTabs.LOGIN}>
              <motion.div
                key={AuthTabs.LOGIN}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Login setTab={setTab} setSwitchTab={setSwitchTab} />
              </motion.div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value={AuthTabs.REGISTER}>
              <motion.div
                key={AuthTabs.REGISTER}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Register setTab={setTab} setSwitchTab={setSwitchTab} />
              </motion.div>
            </TabsContent>

          </Tabs>

        </CardContent>
      </Card>
    </div>

  );
}
