import notify from "devextreme/ui/notify";

const defaultOptions = (toastOptions?: Partial<ToastOptions>) => ({
  message: "Toast par défault ",
  type: "success",
  height: 90,
  width: 300,
  minWidth: 150,
  displayTime: toastOptions?.type === "error" ? 10000 : 3000,
  animation: {
    show: {
      type: "fade",
      duration: 400,
      from: 0,
      to: 1,
    },
    hide: { type: "fade", duration: 40, to: 0 },
  },
});

const defaultPosition: any = {
  position: "top right",
  direction: "down-stack",
};

type ToastOptions = {
  message: string;
  type: "info" | "success" | "error" | "warning";
  displayTime: number;
};

export const displayToast = (
  toastOptions?: Partial<ToastOptions> & Pick<ToastOptions, "message" | "type">
) => {
  notify(
    {
      ...defaultOptions(toastOptions),
      ...toastOptions,
    },
    defaultPosition
  );
};
