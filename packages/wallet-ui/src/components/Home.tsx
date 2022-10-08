import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

// const ErrorMessage = styled.div`
//   background-color: ${({ theme }) => theme.colors.error.muted};
//   border: 1px solid ${({ theme }) => theme.colors.error.default};
//   color: ${({ theme }) => theme.colors.error.alternative};
//   border-radius: ${({ theme }) => theme.radii.default};
//   padding: 2.4rem;
//   margin-bottom: 2.4rem;
//   margin-top: 2.4rem;
//   max-width: 60rem;
//   width: 100%;
//   ${({ theme }) => theme.mediaQueries.small} {
//     padding: 1.6rem;
//     margin-bottom: 1.2rem;
//     margin-top: 1.2rem;
//     max-width: 100%;
//   }
// `;

export const Home = () => {
  // const [state, dispatch] = useContext(MetaMaskContext);

  // const handleSendHelloClick = async () => {
  //   try {
  //     await sendHello();
  //   } catch (e) {
  //     console.error(e);
  //     dispatch({ type: MetamaskActions.SetError, payload: e });
  //   }
  // };

  return (
    <Container>
      <CardContainer>
        {/* {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}*/}
        {/* <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={false}
              />
            ),
          }}
          disabled={false}
          fullWidth={false}
        /> */}
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};
