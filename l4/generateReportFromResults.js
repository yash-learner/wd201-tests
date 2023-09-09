let fs = require("fs");

let generateFeedback = (passed, results) => {
  const feedback = results.map((result) => {
    const checkForFailure = result["name"].includes("Failure");
    const passStatus = checkForFailure ? "failed" : "passed";
    let errorMessages = [];
    const assertionResults = result["assertionResults"]
      .map((item) => {
        let status = item["status"];
        let title = item["title"];
        let statusSymbol = status === "passed" ? "✓" : "✗";
        if (status !== passStatus) {
          errorMessages = errorMessages.concat(item["failureMessages"]);
        }
        return `${statusSymbol} ${title}`;
      })
      .join("\n\n");
    let errorMessage = errorMessages.join("\n\n");

    if (checkForFailure) {
      return (
        "Checking with wrong implementation, the tests should fail" +
        "\n\n" +
        assertionResults +
        "\n\n" +
        errorMessage
      );
    }
    return (
      "Checking with actual implementation, the tests should pass" +
      "\n\n" +
      assertionResults +
      "\n\n" +
      errorMessage
    );
  });

  return feedback.join("\n\n");
};

const writeReport = (data) => {
  console.log(data);
  let reportFile = "./report.json";
  fs.writeFileSync(reportFile, JSON.stringify(data));
};

const readFile = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log("File not found | Grading Skipped");
  }
};

readFile("results.json").then((data) => {
  if (data) {
    let results = JSON.parse(data);
    const testCaseCount = results["numTotalTests"] / 2; // Remove the failure test case we duplicated
    if (testCaseCount < 5) {
      const feedback =
        "You need to implement minimum 5 test cases. ie, \n 1. Test to add a todo \n 2. Test to mark a todo as complete. \n 3. Test to retrieve overdue items \n 4. Test to retrieve due today items \n 5. Test to retrieve due later items.";
      return writeReport({
        version: 0,
        grade: "reject",
        status: "failure",
        feedback: feedback,
        report: feedback,
      });
    }
    const passed = results["testResults"].reduce((acc, result) => {
      const checkForFailure = result["name"].includes("Failure");
      if (checkForFailure) {
        const suiteResult = result["assertionResults"]
          .map((aResult) => aResult.status === "passed")
          .includes(true);
        return acc && !suiteResult;
      }
      return acc && result["status"] === "passed";
    }, true);

    let feedback = generateFeedback(passed, results["testResults"]);
    writeReport({
      version: 0,
      grade: passed ? "accept" : "reject",
      status: passed ? "success" : "failure",
      feedback: feedback,
      report: feedback,
    });
  } else {
    writeReport({
      version: 0,
      grade: "skip",
      status: "failure",
      feedback:
        "We are unable to test your submission - something about it was too different from what we were expecting. Please check the instructions for this task and try again. If you have seen this message more than once, please reach out to Pupilfirst team for support.",
      report: "Unable to generate report due to missing results.json.",
    });
  }
});
