import { toast } from "react-toastify";

type NotificationProps = {
  message: string;
};

type InfoNotificationProps = {
  message: string;
  description?: string;
};

export const successNotification = ({ message }: NotificationProps) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: false,
  });
};

export const errorNotification = ({ message }: NotificationProps) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: false,
  });
};

export const warningNotification = ({ message }: NotificationProps) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: false,
  });
};

export const infoNotification = ({
  message,
  description,
}: InfoNotificationProps) => {
  toast.info(`${message}${description ? `: ${description}` : ''}`, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: false,
  });
};
