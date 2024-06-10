import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  // PDFViewer,
} from "@react-pdf/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type formSchemaType = z.infer<typeof formSchema>;
const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Please enter a title",
    })
    .max(100, {
      message: "Title must be less than 100 characters",
    }),
  name: z.string().min(1, {
    message: "Please enter a name",
  }),
  level: z.string().min(1, {
    message: "Please enter a level",
  }),
  sums: z.array(
    z.object({
      value: z
        .string()
        .min(1, {
          message: "Please enter a value",
        })
        .refine((value) => {
          const numbers = value.split(",").map(Number);
          return numbers.every((num) => !isNaN(num));
        }, "Please enter valid numbers (comma seperated)"),
    })
  ),
});

const initialValues = {
  title: "",
  name: "Farhan Shaik",
  level: "5th Seniors",
  sums: [],
};

const SumsPage = () => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sums",
  });

  const [formvalues, setFormValues] = useState<formSchemaType>(initialValues);
  const isFormValid = form.formState.isValid;

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
    setFormValues(data);
  });

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="gap-4 grid grid-cols-1 md:grid-cols-2 border p-3 mt-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="6th Day homework" {...field} />
                </FormControl>
                <FormDescription>Title for the tables PDF</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Farhan Shaik" {...field} />
                </FormControl>
                <FormDescription>Name for the tables PDF</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input placeholder="5th Seniors" {...field} />
                </FormControl>
                <FormDescription>Level for the tables PDF</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 border p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="col-span-1 md:col-span-4 flex justify-between">
              <h1 className="text-xl">Sums Rows</h1>
              <Button
                type="button"
                onClick={() => {
                  // append({ value: "229.128,42.114,-112.143" });
                  append({ value: "" });
                }}
              >
                Add Row
              </Button>
            </div>

            {fields.map((field, index) => {
              return (
                <div key={field.id} className="group relative mt-2 p-1">
                  <FormField
                    control={form.control}
                    name={`sums.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numbers ({index + 1})</FormLabel>
                        <FormControl>
                          <Input placeholder="2, -2, 12 ,-27" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => {
                      remove(index);
                    }}
                    className="absolute -top-4 -right-2 group-hover:opacity-100 opacity-0 transition-opacity"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button type="submit">Generate PDF</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild type="button">
                <Button
                  type="button"
                  variant={"secondary"}
                  disabled={!isFormValid}
                >
                  {isFormValid ? "Download PDF" : "Fill the form"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dropdown-menu-content-size-adjust">
                <DropdownMenuItem>
                  <PDFDownloadLink
                    document={<SumsPdf data={formvalues} />}
                    fileName="sums.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading document..." : "Download Questions"
                    }
                  </PDFDownloadLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PDFDownloadLink
                    document={<SumsPdf data={formvalues} showAnswers />}
                    fileName="sums-answers.pdf"
                  >
                    {({ loading }) =>
                      loading ? "Loading document..." : "Download Answers"
                    }
                  </PDFDownloadLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </form>
      </Form>

      {/* <PDFViewer className="col-span-2 mt-4 h-[500px] border w-full">
        <SumsPdf data={formvalues} />
      </PDFViewer> */}
    </div>
  );
};

export default SumsPage;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
  },
  mainSumsContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  sumsContainer: {
    flexDirection: "column",
    gap: 4,
    width: "16%",
    border: 1,
    justifyContent: "space-between",
  },
  sumsIndexContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 4,
  },
  sumsIndexText: {
    fontSize: 14,
    color: "white",
  },
  sumsNumbersContainer: {
    flexDirection: "column",
    gap: 1,
    paddingHorizontal: 4,
  },
  sumsNumber: {
    textAlign: "right",
    fontSize: 14,
    color: "blue",
  },
  sumsAnswerContainer: {
    border: 1,
    padding: 4,
    // paddingVertical: 8,
    // alignItems: "flex-end",

    // justifySelf to bottom
  },
  sumsAnswerText: {
    textAlign: "center",
    fontSize: 14,
    color: "green",
  },
});

const SumsPdf = ({
  data,
  showAnswers = false,
}: {
  data: formSchemaType;
  showAnswers?: boolean;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topHeader}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.title}>{data.level}</Text>
        </View>
        <View style={styles.mainSumsContainer}>
          {data.sums.map((sum, index) => {
            const questions = sum.value.split(",").map(Number);
            const answer = questions
              .reduce((acc, curr) => acc + curr, 0)
              .toFixed(3);
            return (
              <View key={index} style={styles.sumsContainer}>
                <View style={styles.sumsIndexContainer}>
                  <Text style={styles.sumsIndexText}>{index + 1}</Text>
                </View>
                <View style={{ ...styles.sumsNumbersContainer, flexGrow: 1 }}>
                  {questions.map((question, qIndex) => {
                    return (
                      <Text key={qIndex} style={styles.sumsNumber}>
                        {question}
                      </Text>
                    );
                  })}
                </View>
                <View
                  style={{
                    ...styles.sumsAnswerContainer,
                    paddingVertical: !showAnswers ? 8 : 4,
                  }}
                >
                  <Text style={styles.sumsAnswerText}>
                    {showAnswers ? answer : ""}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
