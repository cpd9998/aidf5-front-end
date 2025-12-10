import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const AlertDialogBox = ({ message }) => {
  return (
    <Alert className="text-red-500">
      <AlertCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
};

export default AlertDialogBox;
