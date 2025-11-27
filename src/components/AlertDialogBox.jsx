import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const AlertDialogBox = ({ title, desc }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert
        className="text-red-500 w-full max-w-sm md:max-w-md lg:max-w-lg"
        variant="destructive"
      >
        <AlertCircleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{desc}</AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertDialogBox;
