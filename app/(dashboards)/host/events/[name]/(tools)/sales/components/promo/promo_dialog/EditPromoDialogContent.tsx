import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { deletePromoCode, updatePromoCode } from "@/lib/actions/promo";
import { PromoFormSchema } from "../../../types";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";

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
      code: promoCode.code.code,
      discount: promoCode.discount.amount.toString(),
      usageLimit: promoCode.usage_limit?.toString() || undefined,
      status: promoCode.status,
      promoType: promoCode.discount.type,
    },
  });

  const { refresh } = useRouter();

  const onDelete = async () => {
    toast.loading("Deleting promo code...");
    const { error } = await deletePromoCode(promoCode.id);
    if (error) {
      toast.dismiss();
      toast.error("Failed to delete promo code");
      return;
    }
    toast.dismiss();
    toast.success("Promo code updated successfully!");
    refresh();
    closeDialog();
  };

  const onSubmit = async (values: z.infer<typeof PromoFormSchema>) => {
    if (values.usageLimit && Number(values.usageLimit) < promoCode.num_used) {
      toast.error(
        "Usage limit cannot be less than the number of times the promo code has been used"
      );
      await setTimeout(() => {
        toast.dismiss();
      }, 2000);
      return;
    }

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
        {promoCode.num_used > 0 && (
          <p className="text-xs text-muted-foreground">
            This promo code has been used. Only select info can be changed
          </p>
        )}
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithLabel
                    label="Code"
                    placeholder="Enter promo code"
                    {...field}
                    disabled={promoCode.num_used > 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end space-x-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Discount"
                      placeholder="Enter discount"
                      {...field}
                      disabled={promoCode.num_used > 0}
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
                          disabled={promoCode.num_used > 0}
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
                          disabled={promoCode.num_used > 0}
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
          <div className="flex flex-col gap-1">
            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabel
                      label="Usage Limit"
                      placeholder="Enter usage limit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="h-2" />
                </FormItem>
              )}
            />
            <p className="text-muted-foreground text-xs">
              {promoCode.num_used} used
            </p>
          </div>

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
          {promoCode.num_used === 0 ? (
            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="rounded-sm w-24"
                    type="button"
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the promo code.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" className="rounded-sm w-24">
                Save
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button type="submit" className="rounded-sm w-24">
                Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </DialogContent>
  );
}
