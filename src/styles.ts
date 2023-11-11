import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  max-width: 600px;
  padding: 1em;

  > * {
    width: 100%;
  }
`;
