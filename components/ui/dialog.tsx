// components/ui/dialog.tsx v1.0 — 纯 React + Tailwind Dialog（含 Portal）
"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// ---------- Context ----------
interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(name: string): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error(`Dialog.${name} must be used inside <Dialog>`);
  return ctx;
}

// ---------- Root ----------
interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  modal?: boolean;
}

function DialogRoot({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
  modal = true,
}: DialogProps): React.ReactNode {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const titleId = React.useId();
  const descriptionId = React.useId();

  // 锁定 body 滚动
  React.useEffect(() => {
    if (!open || !modal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, modal]);

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
}

// ---------- Trigger ----------
interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext("Trigger");
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

// ---------- Portal ----------
// SSR 安全：客户端直接渲染，SSR 不渲染子元素
// 通过 ref + 惰性初始化避免在 effect 中调用 setState
function Portal({ children }: { children: React.ReactNode }): React.ReactNode {
  const isClientSide =
    typeof window !== "undefined" && typeof document !== "undefined";
  const [clientReady] = React.useState<boolean>(() => isClientSide);
  const afterFirstRenderRef = React.useRef<boolean>(false);
  React.useEffect(() => {
    afterFirstRenderRef.current = true;
  }, []);
  if (!(clientReady || afterFirstRenderRef.current)) return null;
  return <>{children}</>;
}

// ---------- Overlay ----------
interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, children, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
        }}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

// ---------- Content ----------
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onInteractOutside?: () => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onInteractOutside, ...props }, ref) => {
    const { open, setOpen, titleId, descriptionId } = useDialogContext("Content");

    React.useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <Portal>
        <DialogOverlay
          onClick={() => {
            onInteractOutside?.();
            setOpen(false);
          }}
          data-state={open ? "open" : "closed"}
        >
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={false}
          >
            <div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              data-state={open ? "open" : "closed"}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative z-50 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-lg rounded-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className
              )}
              {...props}
            >
              {children}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </DialogOverlay>
      </Portal>
    );
  }
);
DialogContent.displayName = "DialogContent";

// ---------- Header ----------
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

// ---------- Footer ----------
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

// ---------- Title ----------
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    const { titleId } = useDialogContext("Title");
    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
DialogTitle.displayName = "DialogTitle";

// ---------- Description ----------
interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { descriptionId } = useDialogContext("Description");
    return (
      <p
        ref={ref}
        id={descriptionId}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
DialogDescription.displayName = "DialogDescription";

// ---------- Close ----------
interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext("Close");
    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        className={className}
        {...props}
      />
    );
  }
);
DialogClose.displayName = "DialogClose";

// ---------- 组合导出 ----------
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});

// 兼容 shadcn/ui 风格的显式命名导出
export {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
