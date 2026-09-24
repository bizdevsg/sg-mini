import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  clientAreaAccountInputClassName,
  clientAreaAccountInputLabelClassName,
} from "@/components/organisms/client-area-account-profile.shared";

type ClientAreaAccountDateFieldProps = {
  defaultValue: string;
  label: string;
};

export function ClientAreaAccountDateField({
  defaultValue,
  label,
}: ClientAreaAccountDateFieldProps) {
  return (
    <div>
      <label className={clientAreaAccountInputLabelClassName}>
        <span>{label}</span>
        <div className="relative">
          <input
            className={`${clientAreaAccountInputClassName} pr-11`}
            defaultValue={defaultValue}
            type="text"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-200">
            <FontAwesomeIcon
              icon={["fas", "calendar-days"]}
              className="text-sm"
            />
          </span>
        </div>
      </label>
    </div>
  );
}
