import UserSelector from "@/components/user-selector/UserSelector";
import { CreateTsukeRequest, UpdateTsukeRequest } from "@/types/tsukes.request";
import { Tsuke } from "@/types/tsukes.response";
import { UsersResponse } from "@/types/users.response";
import React, { useEffect, useState } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import { Button, Form, Icon, Message, Modal } from "semantic-ui-react";

interface Props {
  open: boolean;
  tsuke?: Tsuke;
  users: UsersResponse;
  onCreated?: (param: CreateTsukeRequest) => void;
  onUpdated?: (param: UpdateTsukeRequest) => void;
  onClosed?: () => void;
}

export default function UpsertTsukeModal({
  open,
  tsuke,
  users,
  onCreated,
  onUpdated,
  onClosed,
}: Props): JSX.Element {
  const [date, setDate] = useState(new Date());
  const [fromUserId, setFromUserId] = useState(-1);
  const [toUserId, setToUserId] = useState(-1);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setDate(tsuke?.date ?? new Date());
      setFromUserId(tsuke?.fromUser.id ?? -1);
      setToUserId(tsuke?.toUser.id ?? -1);
      setAmount(tsuke?.amount ?? 0);
      setDescription(tsuke?.description ?? "");
    }
  }, [open]);

  function upsert() {
    const tzDate = new Date(
      date.valueOf() - date.getTimezoneOffset() * 60 * 1000
    );
    if (tsuke) {
      onUpdated &&
        onUpdated({
          id: tsuke.id,
          date: tzDate,
          fromUserId,
          toUserId,
          amount,
          description,
        });
    } else {
      onCreated &&
        onCreated({
          date: tzDate,
          fromUserId,
          toUserId,
          amount,
          description,
        });
    }
  }

  if (users.allCount < 2) {
    return (
      <Modal
        open={open}
        closeOnDimmerClick={true}
        closeOnEscape={true}
        onClose={onClosed}
      >
        <Modal.Content>
          <Message warning icon>
            <Icon name="warning circle" />
            <Message.Content>????????????2????????????????????????????????????</Message.Content>
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClosed}>?????????</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      closeOnDimmerClick={false}
      closeOnEscape={true}
      onClose={onClosed}
    >
      <Modal.Header>{tsuke ? `???????????????` : `???????????????`}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field required={true}>
            <label>??????</label>
            <SemanticDatepicker
              value={date}
              onChange={(e, { value }) => setDate(value as Date)}
            />
          </Form.Field>
          <Form.Field required={true}>
            <label>??????</label>
            <UserSelector
              users={users}
              initial={fromUserId}
              onChanged={(id) => setFromUserId(id)}
            />
          </Form.Field>
          <Form.Field required={true}>
            <label>??????</label>
            <UserSelector
              users={users}
              initial={toUserId}
              onChanged={(id) => setToUserId(id)}
            />
          </Form.Field>
          <Form.Field required={true}>
            <label>??????</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </Form.Field>
          <Form.Field required={true}>
            <label>??????</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClosed}>???????????????</Button>
        <Button onClick={upsert} primary>
          {tsuke ? "??????" : "??????"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
