import api, { route } from "@forge/api";
import ForgeUI, {
  render,
  Fragment,
  Text,
  Macro,
  useProductContext,
  useState,
  Heading,
  Code,
  Link,
  User,
  Badge,
} from "@forge/ui";

const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(
      route`/rest/api/content/${contentId}/child/comment?expand=body.atlas_doc_format,metadata.likes,history,container`
    );

  const data = await res.json();
  return data.results;
};

const App = () => {
  const context = useProductContext();
  const [comments] = useState(
    async () => await fetchCommentsForContent(context.contentId)
  );
  const getLatestMostLikedComment = true;

  const getMostLikedComment = () => {
    let highestCount = 0;
    const output = comments.reduce((accumulator, data) => {
      const count = data.metadata.likes.count;
      const isHighestCount = getLatestMostLikedComment
        ? data.metadata.likes.count >= highestCount
        : data.metadata.likes.count > highestCount;
      if (isHighestCount) {
        highestCount = count;
        accumulator = {
          ...data.body,
          ...data.metadata,
          ...data._links,
          history: data.history,
        };
      }
      return accumulator;
    }, []);
    if (highestCount === 0) {
      return false;
    }
    return output;
  };

  const getOpenCommentURL = (url, webui) => {
    var pathArray = url.split("/");
    var protocol = pathArray[0];
    var host = pathArray[2];
    var url = protocol + "//" + host + "/wiki" + webui;
    return url;
  };

  const renderText = ({ text, marks }) => {
    const markTypes = marks?.map((obj) => obj.type);
    if (markTypes?.includes("code")) {
      return <Code text={text} />;
    }
    return <Text>{text}</Text>;
  };

  const renderMostLikedComment = (data) => {
    const dataJSON = data && JSON.parse(data?.atlas_doc_format?.value);
    return dataJSON?.content?.map((obj) => {
      const { text, marks, type } = obj?.content?.[0] || {};
      return text && renderText({ text, marks, type });
    });
  };

  const mostLikedComment = getMostLikedComment();

  return (
    <Fragment>
      {mostLikedComment ? (
        <Fragment>
          <Heading>
            Most liked comment{" "}
            {<Badge appearance="added" text={mostLikedComment?.likes?.count} />}
          </Heading>
          {renderMostLikedComment(mostLikedComment)}
          <Text>
            Contributor(s):{" "}
            <User accountId={mostLikedComment.history.createdBy.accountId} />
          </Text>
          <Text>
            <Link
              openNewTab
              appearance="button"
              href={getOpenCommentURL(
                mostLikedComment.self,
                mostLikedComment.webui
              )}
            >
              Open comment
            </Link>
          </Text>
        </Fragment>
      ) : (
        <Text>Please leave a comment on any questions or useful tips!</Text>
      )}
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} />);

// editor: '',
//     atlas_doc_format: '',
//     view: '',
//     export_view: '',
//     styled_view: '',
//     dynamic: '',
//     storage: '',
//     editor2: '',
//     anonymous_export_view: ''
