import Swal from "sweetalert2";

export const customSwal = Swal.mixin({
  width: 350,
  buttonsStyling: false,
  iconColor: "var(--color-primary)",

  customClass: {
    popup: "!bg-base-100 !rounded-box",
    title: "!text-base-content !text-2xl !font-semibold",
    confirmButton:
      "btn btn-error text-base-100 border-none outline-none ring-0 focus:outline-none focus:ring-0 mr-5 mt-5",
    cancelButton:
      "btn btn-primary text-base-100 border-none outline-none ring-0 focus:outline-none focus:ring-0 mt-5",
  },
});
