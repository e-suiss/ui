import { cn } from "cn"
import { TextInput } from "react-native"

function Input({
  className,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "h-9 w-full min-w-0 flex-row items-center rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base leading-5 text-foreground focus:border-ring",
        props.editable === false && "opacity-50",
        className
      )}
      placeholderTextColorClassName="accent-muted-foreground"
      {...props}
    />
  )
}

export { Input }
