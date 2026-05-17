# Transactional Alt-Drag Moves

Authored by GPT-5.5 in Cursor.

Are.na Multiplexer lets users drag blocks between open channel windows. A normal drag copies the block by creating a new connection in the destination channel. Holding `Alt` changes that gesture into a move: the app should connect the block to the destination and disconnect it from the source as one coordinated operation.

The client implements this with transaction-like semantics:

- The destination window creates the new connection first and keeps the block in a pending state.
- The source connection is deleted only after the destination connection exists.
- The destination window commits the visible block only after both API operations succeed.
- If deleting the source connection fails after the destination connection was created, the app compensates by deleting the new destination connection and removing the pending destination block.
- The source window removes the original block only after the destination window dispatches the commit event.

This is still a client-side transaction, not a server-side atomic transaction. If the compensating delete fails, Are.na may temporarily retain the newly created destination connection, and the client logs that rollback failure for debugging.
