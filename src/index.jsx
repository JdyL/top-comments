import api, { route } from "@forge/api";
import ForgeUI, {
  render,
  Fragment,
  Text,
  Macro,
  useProductContext,
  useState,
  Heading,
} from "@forge/ui";

const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(
      route`/rest/api/content/${contentId}/child/comment?expand=body.atlas_doc_format,metadata.likes`
    );

  const data = await res.json();
  return data.results;
};

const App = () => {
  const context = useProductContext();
  const [comments] = useState(
    async () => await fetchCommentsForContent(context.contentId)
  );

  const getMostLikedComment = () => {
    let highestCount = 0;
    const output = comments.reduce((accumulator, data) => {
      const count = data.metadata.likes.count;
      if (data.metadata.likes.count > highestCount) {
        highestCount = count;
        accumulator = { ...data.body, ...data.metadata };
      }
      return accumulator;
    }, []);
    if (highestCount === 0) {
      return false;
    }
    return output;
  };

  const mostLikedComment = getMostLikedComment();
  console.log(mostLikedComment);

  return (
    <Fragment>
      <Heading>Most liked comment</Heading>
      {/* <Fragment>{mostLikedComment?.}</Fragment> */}
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
