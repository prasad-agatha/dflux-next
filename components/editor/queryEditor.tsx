// react
import React, { FC } from "react";
// monaco-editor
import Editor, { useMonaco } from "@monaco-editor/react";
// constants
import { editorOptions, SQLKeywords } from "constants/editorOptions";
import _ from "lodash";

interface IQueryEditorProps {
  defaultValue: any;
  sqlQuery: any;
  handleEditorChange: any;
  editorSuggestions: any;
  theme: any;
}
const QueryEditor: FC<IQueryEditorProps> = (props) => {
  const { editorSuggestions, defaultValue, sqlQuery, handleEditorChange, theme } = props;

  // monaco
  const monaco = useMonaco();

  const createDependencyProposals = (val: any) => {
    const newArr: any = [];
    val?.map((item: any) => {
      const obj1: any = {};
      obj1["label"] = item.table_name;
      obj1["insertText"] = item.table_name;
      obj1["detail"] = "table/column";
      obj1["kind"] = monaco?.languages.CompletionItemKind.Field;
      newArr.push(obj1);
    });
    val?.map((item: any) => {
      item.suggestions.map((item1: any) => {
        const obj: any = {};
        obj["label"] = item1;
        obj["insertText"] = item1;
        obj["detail"] = "table/column";
        obj["kind"] = monaco?.languages.CompletionItemKind.Field;
        newArr.push(obj);
      });
    });

    return newArr;
  };

  React.useEffect(() => {
    if (monaco && editorSuggestions) {
      monaco.languages.register({
        id: "sql",
      });

      // Register a completion item provider for the new language
      monaco.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: () => {
          const newData = createDependencyProposals(editorSuggestions);
          // console.log(newData);
          const sqlKeywords: any = [];
          let suggestions: any = [];
          SQLKeywords.map((item: any) => {
            const obj: any = {
              ...item,
              kind: monaco?.languages.CompletionItemKind.Field,
            };
            sqlKeywords.push(obj);
          });
          suggestions = [...sqlKeywords, ...newData];
          const tempSuggestions = _.uniqWith(suggestions, _.isEqual);
          return {
            suggestions: tempSuggestions,
          };
        },
      });
    }
  }, [editorSuggestions]);

  return (
    <Editor
      className="query-4"
      theme={theme}
      loading="Loading...."
      options={editorOptions}
      height="100%"
      width="100%"
      value={sqlQuery || ""}
      defaultLanguage="sql"
      defaultValue={defaultValue}
      onChange={handleEditorChange}
      // beforeMount={handleEditorWillMount}
    />
  );
};
export default QueryEditor;
