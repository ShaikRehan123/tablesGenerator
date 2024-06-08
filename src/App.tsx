import { z } from "zod";
import { ModeToggle } from "./components/mode-toggle";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { TrashIcon } from "lucide-react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  // PDFViewer,
} from "@react-pdf/renderer";
import { useState } from "react";

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
  tableOrder: z.string().min(1, {
    message: "Please select table order",
  }),
  tableType: z.string().min(1, {
    message: "Please select table type",
  }),
  tableNumbers: z.array(
    z.object({
      number: z
        .string()
        .min(1, {
          message: "Please enter a number",
        })
        .refine((data) => !isNaN(parseFloat(data)), {
          message: "Please enter a valid number",
        }),
      startingNumber: z
        .string()
        .min(1, {
          message: "Please enter a starting number",
        })
        .refine((data) => !isNaN(parseFloat(data)), {
          message: "Please enter a valid number",
        }),
    })
  ),
});

const initialValues = {
  title: "",
  name: "Farhan Shaik",
  level: "5th Seniors",
  tableOrder: "straight",
  tableType: "multiplication",
  tableNumbers: [],
};

function App() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tableNumbers",
  });

  const [formvalues, setFormValues] = useState<formSchemaType>(initialValues);
  const isFormValid = form.formState.isValid;

  const onSubmit = form.handleSubmit((data) => {
    setFormValues(data);
  });

  return (
    <div className="min-h-screen min-w-screen p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl">Multiplication/Division Tables Generator</h1>
        <ModeToggle />
      </div>

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

          <FormField
            control={form.control}
            name="tableOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Table Order</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the table order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="reverse">Reverse</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the table order for the tables PDF
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tableType"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Table Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the table type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="multiplication">
                      Multiplication
                    </SelectItem>
                    <SelectItem value="division">Division</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the table type for the tables PDF
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 md:col-span-2 border p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-3 flex justify-between">
              <h1 className="text-xl">Table Numbers</h1>
              <Button
                type="button"
                onClick={() => {
                  append({
                    number: "",
                    startingNumber: "1",
                  });
                }}
                className="w-[200px] self-end mb-2"
                variant={"secondary"}
              >
                Add Table Number
              </Button>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 gap-4 p-1 relative mt-2 group"
              >
                <FormField
                  control={form.control}
                  name={`tableNumbers.${index}.number`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input placeholder="2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tableNumbers.${index}.startingNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting No</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
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
            ))}
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button type="submit">Generate PDF</Button>
            <Button
              type="button"
              variant={"secondary"}
              disabled={!isFormValid}
              asChild={isFormValid}
            >
              {!isFormValid ? (
                "Please fill the form"
              ) : (
                <PDFDownloadLink
                  document={
                    formvalues.tableType === "multiplication" ? (
                      <MultiplicationTablesPDF data={formvalues} />
                    ) : (
                      <DivisionTablesPDF data={formvalues} />
                    )
                  }
                  fileName="multiplication-tables.pdf"
                >
                  {({ loading }) =>
                    loading ? "Loading document..." : "Download Questions"
                  }
                </PDFDownloadLink>
              )}
            </Button>
            <Button
              type="button"
              variant={"outline"}
              disabled={!isFormValid}
              asChild={isFormValid}
            >
              {!isFormValid ? (
                "Please fill the form"
              ) : (
                <PDFDownloadLink
                  document={
                    formvalues.tableType === "multiplication" ? (
                      <MultiplicationTablesPDF data={formvalues} showAnswers />
                    ) : (
                      <DivisionTablesPDF data={formvalues} showAnswers />
                    )
                  }
                  fileName="multiplication-tables.pdf"
                >
                  {({ loading }) =>
                    loading ? "Loading document..." : "Download Answers"
                  }
                </PDFDownloadLink>
              )}
            </Button>
          </div>

          <PDFViewer className="col-span-2 mt-4 h-[500px] border w-full">
            {/* <MultiplicationTablesPDF data={formvalues} /> */}
            {formvalues.tableType === "multiplication" ? (
              <MultiplicationTablesPDF data={formvalues} />
            ) : (
              <DivisionTablesPDF data={formvalues} />
            )}
          </PDFViewer>
        </form>
      </Form>
    </div>
  );
}

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
  mainTablesContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  tableContainer: {
    flexDirection: "column",
    width: "19%",
    border: 1,
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    padding: 3,
    // gap: 5,
  },
  tableQuestion: {
    fontSize: 14,
    fontWeight: "bold",
    color: "blue",
  },
});

const MultiplicationTablesPDF = ({
  data,
  showAnswers = false,
}: {
  data: formSchemaType;
  showAnswers?: boolean;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.topHeader}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.title}>{data.level}</Text>
        </View>
        <View style={styles.mainTablesContainer}>
          {data.tableNumbers.map((number, index) => {
            const multiplicationNumber = Number(number.number);
            const startingNumber = Number(number.startingNumber);

            const isStraight = data.tableOrder === "straight";
            const numberToMultiplyStart = isStraight
              ? startingNumber
              : startingNumber + 9;
            const numberToMultiplyStep = isStraight ? 1 : -1;

            return (
              <View key={index} style={styles.tableContainer}>
                <View>
                  {Array.from({ length: 10 }, (_, i) => i).map((i) => {
                    const numberToMultiply =
                      numberToMultiplyStart + i * numberToMultiplyStep;

                    return (
                      <View
                        key={i}
                        style={{
                          ...styles.tableRow,
                        }}
                      >
                        <Text style={styles.tableQuestion}>
                          {multiplicationNumber} x {numberToMultiply}
                        </Text>
                        <Text
                          style={{
                            ...styles.tableQuestion,
                            marginLeft: numberToMultiply == 10 ? 4 : 12,
                          }}
                        >
                          =
                        </Text>
                        <Text
                          style={{ ...styles.tableQuestion, marginLeft: 12 }}
                        >
                          {showAnswers
                            ? multiplicationNumber * numberToMultiply
                            : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const DivisionTablesPDF = ({
  data,
  showAnswers = false,
}: {
  data: formSchemaType;
  showAnswers?: boolean;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.topHeader}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.title}>{data.level}</Text>
        </View>
        <View style={styles.mainTablesContainer}>
          {data.tableNumbers.map((number, index) => {
            const multiplicationNumber = Number(number.number);
            const startingNumber = Number(number.startingNumber);

            const isStraight = data.tableOrder === "straight";
            const numberToDivideStart = isStraight
              ? startingNumber
              : startingNumber + 9;
            const numberToDivideStep = isStraight ? 1 : -1;

            return (
              <View
                key={index}
                style={{ ...styles.tableContainer, width: "33%" }}
              >
                <View>
                  {Array.from({ length: 10 }, (_, i) => i).map((i) => {
                    const numberToDivide =
                      numberToDivideStart + i * numberToDivideStep;

                    return (
                      <View
                        key={i}
                        style={{
                          ...styles.tableRow,
                        }}
                      >
                        <Text style={styles.tableQuestion}>
                          {multiplicationNumber} ÷ {numberToDivide}
                        </Text>
                        <Text
                          style={{
                            ...styles.tableQuestion,
                            marginLeft: numberToDivide == 10 ? 4 : 12,
                          }}
                        >
                          =
                        </Text>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Text
                            style={{
                              ...styles.tableQuestion,
                              marginLeft: 12,
                            }}
                          >
                            Q=
                          </Text>
                          <Text
                            style={{
                              ...styles.tableQuestion,
                              marginLeft: 4,
                              border: 1,
                              paddingHorizontal: 2,
                            }}
                          >
                            {showAnswers
                              ? Math.floor(
                                  multiplicationNumber / numberToDivide
                                )
                              : "               "}
                          </Text>
                          <Text
                            style={{
                              ...styles.tableQuestion,
                              marginLeft: 12,
                            }}
                          >
                            R=
                          </Text>
                          <Text
                            style={{
                              ...styles.tableQuestion,
                              marginLeft: 4,
                              border: 1,
                              paddingHorizontal: 2,
                            }}
                          >
                            {showAnswers
                              ? multiplicationNumber % numberToDivide
                              : "          "}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default App;
