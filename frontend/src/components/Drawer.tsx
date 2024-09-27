import { FC } from "react";
import DrawerChild from "./DrawerChild";
import { Icon } from "@iconify/react";

export const Drawer: FC<IDrawer> = ({
  children,
  title,
  show,
  setShow,
  buttonData,
  onClose,
  testId,
}) => {
  return (
    <div className={`${show ? "w-full h-full p-2" : ""}`}>
      {show && (
        <button
          type="button"
          className="fixed inset-0  z-50 bg-neutrals/100% bg-opacity-30 backdrop-blur-[1px]"
          onClick={() => setShow(false)}
          data-testid="show-drawer"
        >
          <span className="hidden">x</span>
        </button>
      )}
      <DrawerChild show={show}>
        <div className={`p-4 h-screen w-[100vw] md:w-[65vw] xl:w-[60vw]`}>
          <div
            className={`p-7 bg-neutral-100 relative shadow-lg text-center rounded-lg h-[calc(100vh-3.6%)]`}
          >
            <div className="pb-3 w-full flex justify-between items-center border-b-neutral-200 border-b">
              <div className="flex items-center gap-x-2">
                <p className="font-bold text-base text-[#0c0c0c] capitalize">
                  {title}
                </p>
              </div>

              <button
                onClick={() => {
                  setShow(false);
                  if (onClose) onClose();
                }}
                data-testid={testId ?? "handle-close-drawery-1"}
                type="button"
              >
                <span className="hidden">x</span>
                <Icon icon="ph:x-circle" className="w-6 h-6 text-[#0c0c0c]" />
              </button>
            </div>

            <div
              className={`text-left overflow-y-scroll overflow-x-hidden py-8  ${
                buttonData ? "h-[75%] md:h-[77%] lg:h-[80%]" : " h-[90%]"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      </DrawerChild>
    </div>
  );
};
