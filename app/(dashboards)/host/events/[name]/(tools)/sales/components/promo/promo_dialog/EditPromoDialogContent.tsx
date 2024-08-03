import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PromoCode } from "../table/PromoDataColumns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updatePromoCode } from "@/lib/actions/promo";
import { PromoFormSchema } from "../../../types";

export default function EditPromoDialogContent({
  promoCode,
  eventId,
  closeDialog,
}: {
  promoCode: PromoCode;
  eventId: string;
  closeDialog: () => void;
}) {
  const form = useForm<z.infer<typeof PromoFormSchema>>({
    resolver: zodResolver(PromoFormSchema),
    defaultValues: {
      id: promoCode.id,
      code: promoCode.code,
      discount: promoCode.discount.amount.toString(),
      usageLimit: promoCode.usage_limit?.toString() || undefined,
      status: promoCode.status,
      promoType: promoCode.discount.type,
    },
  });

  const { refresh } = useRouter();

  const onSubmit = async (values: z.infer<typeof PromoFormSchema>) => {
    toast.loading("Updating promo code...");

    const { error } = await updatePromoCode(eventId, values);

    if (error) {
      toast.dismiss();
      toast.error("Failed to update promo code");
      return;
    }

    toast.dismiss();
    toast.success("Promo code updated successfully!");
    refresh();
    closeDialog();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-4">Edit Promo Code</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label="Code (case sensitive)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingLabelInput
                      label="Discount"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promoType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="PERCENT"
                          checked={field.value === "PERCENT"}
                          onCheckedChange={(checked) =>
                            field.onChange("PERCENT")
                          }
                        />
                        <label
                          htmlFor="PERCENT"
                          className="text-sm font-medium leading-none"
                        >
                          %
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="DOLLAR"
                          checked={field.value === "DOLLAR"}
                          onCheckedChange={(checked) =>
                            field.onChange("DOLLAR")
                          }
                        />
                        <label
                          htmlFor="DOLLAR"
                          className="text-sm font-medium leading-none"
                        >
                          $
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput label="Usage Limit" {...field} />
                </FormControl>
                <FormMessage className="h-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ACTIVE"
                        checked={field.value === "ACTIVE"}
                        onCheckedChange={(checked) => field.onChange("ACTIVE")}
                      />
                      <label
                        htmlFor="ACTIVE"
                        className="text-sm leading-none bg-primary/10 text-green-600 rounded-[3px] font-semibold p-1 w-fit"
                      >
                        Active
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="DOLLAR"
                        checked={field.value === "INACTIVE"}
                        onCheckedChange={(checked) =>
                          field.onChange("INACTIVE")
                        }
                      />
                      <label
                        htmlFor="INACTIVE"
                        className="text-sm leading-none bg-destructive/10 text-red-600 rounded-[3px] font-semibold p-1 w-fit"
                      >
                        Inactive
                      </label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="h-2" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="rounded-sm w-24">Edit</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
