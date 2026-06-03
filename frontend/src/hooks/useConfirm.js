import { customSwal } from "../utils/swal";

export const useConfirm = () => {
  const confirm = async ({
    title,
    text,
    icon = "warning",
    confirmText = "Confirm",
    cancelText = "Cancel",
  }) => {
    const result = await customSwal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });

    return result.isConfirmed;
  };

  return confirm;
};
