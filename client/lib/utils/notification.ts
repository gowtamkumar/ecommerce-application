import { notification } from "antd";

type NotificationProps = {
  message: string;
};

type InfoNotificationProps = {
  message: string;
  description?: string;
};

export const successNotification = ({ message }: NotificationProps) => {
  notification.success({
    message,
    duration: 3,
    showProgress: true,
    pauseOnHover: true,
  });
};

export const errorNotification = ({ message }: NotificationProps) => {
  console.log("message", message);
  
  notification.error({
    message,
    duration: 3,
  });
};

export const warningNotification = ({ message }: NotificationProps) => {
  notification.warning({
    message,
    duration: 3,
  });
};

export const infoNotification = ({
  message,
  description,
}: InfoNotificationProps) => {
  notification.info({
    message,
    description,
    duration: 3,
  });
};
