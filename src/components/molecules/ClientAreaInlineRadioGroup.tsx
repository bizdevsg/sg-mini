import {
  clientAreaAccountInlineInputClassName,
  clientAreaAccountInputLabelClassName,
  type ClientAreaRadioOption,
} from "@/components/organisms/client-area-account-profile.shared";

type ClientAreaInlineRadioGroupProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: ClientAreaRadioOption[];
  required?: boolean;
  selectedValue: string;
  trailingInputForValue?: string;
};

export function ClientAreaInlineRadioGroup({
  label,
  name,
  onChange,
  options,
  required = false,
  selectedValue,
  trailingInputForValue,
}: ClientAreaInlineRadioGroupProps) {
  return (
    <div className="space-y-2">
      <p className={clientAreaAccountInputLabelClassName}>
        {label}
        {required ? <span className="text-red-400">*</span> : null}
      </p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-100">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <label
              key={`${name}-${option.value}`}
              className="inline-flex items-center gap-1.5"
            >
              <input
                checked={isSelected}
                className="h-4 w-4 accent-yellow-400"
                name={name}
                onChange={() => onChange(option.value)}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
              {trailingInputForValue === option.value ? (
                <input
                  className={clientAreaAccountInlineInputClassName}
                  defaultValue=""
                  type="text"
                />
              ) : null}
            </label>
          );
        })}
      </div>
    </div>
  );
}
