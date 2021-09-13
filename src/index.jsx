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
  const routeFlags = [
    "body.atlas_doc_format",
    "metadata.likes",
    "history",
    "container",
    "children.comment.body.atlas_doc_format",
    "children.comment.metadata.likes",
    "children.comment.history",
  ].join(",");
  const res = await api
    .asUser()
    .requestConfluence(
      route`/rest/api/content/${contentId}/child/comment?expand=${routeFlags}`
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

  const extractCommentInfo = ({
    content,
    count,
    highestCount,
    setHighestCount,
    setAccumulator,
  }) => {
    const isHighestCount = getLatestMostLikedComment
      ? count >= highestCount
      : count > highestCount;
    if (isHighestCount) {
      setHighestCount(count);
      setAccumulator({
        ...content.body,
        ...content.metadata,
        ...content._links,
        history: content.history,
      });
    }
  };

  const getMostLikedComment = () => {
    let highestCount = 0;
    const setHighestCount = (count) => {
      highestCount = count;
    };
    const output = comments.reduce((accumulator, data) => {
      const setAccumulator = (val) => {
        accumulator = val;
      };
      const replies = data?.children.comment.results;
      replies?.map((reply) => {
        extractCommentInfo({
          count: reply.metadata.likes.count,
          highestCount,
          setHighestCount,
          content: reply,
          setAccumulator,
        });
      });
      extractCommentInfo({
        count: data.metadata.likes.count,
        highestCount,
        setHighestCount,
        content: data,
        setAccumulator,
      });
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

  const isGroup = {
    listItem: true,
  };

  const renderText = ({ content, inline, type }) => {
    const output = content?.map((obj) => {
      const markTypes = obj?.marks?.map((obj) => obj.type);
      if (markTypes?.includes("code")) {
        return <Code text={obj.text} />;
      }
      switch (obj.type) {
        case "inlineCard":
          return (
            <Link href={obj.attrs.url}>
              {obj?.attrs?.__confluenceMetadata.contentTitle}
            </Link>
          );
        case "listItem":
          return <Text>- {obj.content?.[0]?.content?.[0]?.text}</Text>;
        case "mention":
          return (
            <Fragment>
              @<User accountId={obj.attrs.id} />
            </Fragment>
          );
        case "emoji":
          return obj.attrs?.text;
        default: {
          if (type === "heading")
            return <Heading size="medium">{obj?.text}</Heading>;
          return obj?.text;
        }
      }
    });
    if (inline) return output;
    return isGroup[content?.[0]?.type] ||
      content?.[0]?.marks?.map((obj) => obj.type).includes("code") ||
      type === "heading" ? (
      <Fragment>{output}</Fragment>
    ) : (
      <Text>{output}</Text>
    );
  };

  const renderMostLikedComment = (data) => {
    const dataJSON = data && JSON.parse(data?.atlas_doc_format?.value);

    return dataJSON?.content?.map((obj) => {
      return renderText({ content: obj?.content, type: obj?.type });
    });
  };

  const mostLikedComment = getMostLikedComment();

  return (
    <Fragment>
      {mostLikedComment ? (
        <Fragment>
          <Heading>
            Most helpful comment{" "}
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
        <Text>Please leave a comment!</Text>
      )}
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} />);
