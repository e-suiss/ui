import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SubscriptionPlans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a plan</CardTitle>
        <CardDescription>Switch or cancel anytime.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="gap-4">
          <TabsList className="w-full">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <RadioGroup defaultValue="family" aria-label="Monthly plan">
              <FieldLabel htmlFor="plan-monthly-solo">
                <Field orientation="horizontal">
                  <RadioGroupItem value="solo" id="plan-monthly-solo" />
                  <FieldContent>
                    <FieldTitle>Solo</FieldTitle>
                    <FieldDescription>One listener, ad-free</FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$9</span>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="plan-monthly-family">
                <Field orientation="horizontal">
                  <RadioGroupItem value="family" id="plan-monthly-family" />
                  <FieldContent>
                    <FieldTitle>
                      Family <Badge>Popular</Badge>
                    </FieldTitle>
                    <FieldDescription>Up to 6 people at home</FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$15</span>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="plan-monthly-studio">
                <Field orientation="horizontal">
                  <RadioGroupItem value="studio" id="plan-monthly-studio" />
                  <FieldContent>
                    <FieldTitle>Studio</FieldTitle>
                    <FieldDescription>
                      Lossless audio and stems
                    </FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$24</span>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </TabsContent>
          <TabsContent value="yearly">
            <RadioGroup defaultValue="family" aria-label="Yearly plan">
              <FieldLabel htmlFor="plan-yearly-solo">
                <Field orientation="horizontal">
                  <RadioGroupItem value="solo" id="plan-yearly-solo" />
                  <FieldContent>
                    <FieldTitle>Solo</FieldTitle>
                    <FieldDescription>One listener, ad-free</FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$90</span>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="plan-yearly-family">
                <Field orientation="horizontal">
                  <RadioGroupItem value="family" id="plan-yearly-family" />
                  <FieldContent>
                    <FieldTitle>
                      Family <Badge>Popular</Badge>
                    </FieldTitle>
                    <FieldDescription>Up to 6 people at home</FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$150</span>
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="plan-yearly-studio">
                <Field orientation="horizontal">
                  <RadioGroupItem value="studio" id="plan-yearly-studio" />
                  <FieldContent>
                    <FieldTitle>Studio</FieldTitle>
                    <FieldDescription>
                      Lossless audio and stems
                    </FieldDescription>
                  </FieldContent>
                  <span className="font-semibold tabular-nums">$240</span>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Start free trial</Button>
        <p className="text-center text-muted-foreground text-xs">
          7 days free, then billed at the plan price.
        </p>
      </CardFooter>
    </Card>
  )
}
