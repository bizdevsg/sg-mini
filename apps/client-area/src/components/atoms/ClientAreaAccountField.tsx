import {
  clientAreaAccountInputClassName,
  clientAreaAccountInputLabelClassName,
} from "@/components/organisms/client-area-account-profile.shared";

type ClientAreaAccountFieldProps = {
  defaultValue: string;
  label: string;
  required?: boolean;
  span?: 1 | 2;
};

export function ClientAreaAccountField({
  defaultValue,
  label,
  required = false,
  span = 1,
}: ClientAreaAccountFieldProps) {
  return (
    <div className={span === 2 ? "col-span-full" : undefined}>
      <label className={clientAreaAccountInputLabelClassName}>
        <span>
          {label}
          {required ? <span className="text-red-400">*</span> : null}
        </span>
        <input
          className={clientAreaAccountInputClassName}
          defaultValue={defaultValue}
          type="text"
        />
      </label>
    </div>
  );
}
