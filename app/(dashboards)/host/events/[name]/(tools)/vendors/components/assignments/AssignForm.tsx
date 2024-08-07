"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveVendorAssignment } from "@/lib/actions/vendors/assignments";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FormSchema = z.object({
  vendor: z.string({
    required_error: "Please select a vendor.",
  }),
  assignment: z.string({ required_error: "Please select an assignment." }),
});

export default function AssignForm({
  event_id,
  vendors,
  numTables,
}: {
  event_id: string;
  vendors: any;
  numTables: number;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { refresh } = useRouter();

  async function onSubmit() {
    toast.loading("Saving assignment...");
    const type = vendors.find(
      (vendor: any) => vendor.vendor_id === form.getValues().vendor
    ).type;

    await saveVendorAssignment(
      event_id,
      form.getValues().vendor,
      type,
      form.getValues().assignment
    );

    toast.dismiss();
    toast.success("Assignment saved!");
    refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4 items-center my-4"
      >
        <div className="flex gap-4 items-center">
          <h3>Assign</h3>
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="space-x-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor: any) => (
                      <SelectItem value={vendor.vendor_id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-center">
          <h3>To</h3>
          <FormField
            control={form.control}
            name="assignment"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="space-x-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Table Number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">N/A</SelectItem>
                    {Array(numTables)
                      .fill(0)
                      .map((_, i) => (
                        <SelectItem value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
