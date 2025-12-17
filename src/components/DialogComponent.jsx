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

export function DialogComponent({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} className="z-50 ">
      <DialogContent className={`lg:max-w-[1024px] bg-white`}>
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
