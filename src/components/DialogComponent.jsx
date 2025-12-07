import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogComponent({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
}) {
  console.log("isOpen", isOpen);
  console.log("onOpenChange", onOpenChange);
  console.log("title", title);
  console.log("description", description);
  console.log("children", children);
  console.log("footer", footer);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} className="z-50 ">
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
