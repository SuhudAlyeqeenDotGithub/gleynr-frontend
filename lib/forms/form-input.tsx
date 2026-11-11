import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
};

export const FormInput = ({ label, error, id, ...props }: FormInputProps) => {
  const generatedId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const isPassword = props.type === "password";

  return (
    <div>
      <div
        className={
          isPassword
            ? "form-input-control form-input-password"
            : "form-input-control"
        }
      >
        <label htmlFor={inputId}>
          {label}
          <input
            {...props}
            id={inputId}
            type={isPassword && passwordVisible ? "text" : props.type}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [props["aria-describedby"], error && errorId]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
        </label>
        {isPassword && (
          <button
            type="button"
            className="form-input-password-toggle"
            aria-label={`${passwordVisible ? "Hide" : "Show"} ${label.toLowerCase()}`}
            aria-pressed={passwordVisible}
            disabled={props.disabled}
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div id={errorId} className="form-error">
          {error}
        </div>
      )}
    </div>
  );
};
