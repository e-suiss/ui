import { cn } from "cn"
import { cssInterop } from "nativewind"
import { TextInput } from "react-native"

cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
})

function Textarea({
  className,
  multiline = true,
  numberOfLines = 8,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "min-h-16 w-full flex-row rounded-2xl border border-transparent bg-input-50 px-3 py-3 text-base text-foreground focus:border-ring md:text-sm",
        props.editable === false && "opacity-50",
        className
      )}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderClassName="text-muted-foreground"
      {...props}
    />
  )
}

export { Textarea }
